# Project-Training
# Backend-C#
# 🏗️ โครงสร้าง Backend Project — ASP.NET Core + Clean Architecture

> **Pattern:** Vertical Slice Architecture  
> **Stack:** ASP.NET Core · EF Core · MySQL · MediatR · Serilog · Swagger

---

## การไหลของ Request

```
HTTP Request
    ↓
Controllers/        — รับ request เข้ามา
    ↓
MediatR (Send)      — ส่งต่อ command/query
    ↓
Features/ Handler   — ประมวลผล business logic
    ↓
Repository          — Interface (Domain) ← Implement (Infrastructure)
    ↓
MySQL Database
```

---

## 📁 Controllers/

**หน้าที่:** ประตูรับ HTTP request — ไม่มี business logic อยู่ที่นี่เลย

รับ request เข้ามาแล้วโยนให้ MediatR จัดการต่อทันที  
ไม่ query database, ไม่คำนวณ, ไม่แปลงข้อมูลเอง

```csharp
[HttpGet]
public async Task<IActionResult> GetAll()
{
    var result = await _mediator.Send(new GetMembersQuery());
    return Ok(result);
}
```

---

## 📁 Features/

**หน้าที่:** จัดกลุ่ม code ตาม feature (Vertical Slice)

ทุกอย่างที่เกี่ยวกับ `Members` อยู่ใน `Features/Members/` หมด  
ไม่ต้องกระโดดหาไฟล์ข้ามหลาย folder

### Commands/ — Write Operations
สำหรับ action ที่ **เปลี่ยนแปลงข้อมูล** (Create, Update, Delete)

```
CreateMemberCommand.cs   → บอกว่าต้องการข้อมูลอะไร
CreateMemberHandler.cs   → ทำงานจริง
```

### Queries/ — Read Operations
สำหรับ action ที่ **แค่ดึงข้อมูล** ไม่เปลี่ยนแปลงอะไร

```
GetMembersQuery.cs       → query + handler รวมไฟล์เดียว
```

### DTOs/ — Data Transfer Objects
รูปแบบข้อมูลที่ส่งออกไปให้ client — ไม่ expose Entity ตรงๆ

```csharp
public record MemberDto(int Id, string? Username);
// ไม่มี Password — client ไม่ควรเห็น
```

---

## 📁 Domain/

**หน้าที่:** หัวใจของ application — ไม่รู้จัก database หรือ framework ใดๆ

เป็นส่วนที่ stable ที่สุด ไม่ค่อยเปลี่ยน  
ถ้าอยากเปลี่ยนจาก MySQL เป็น PostgreSQL → Domain ไม่ต้องแตะ

### Entities/
Business object หลักของระบบ

```csharp
public class Member
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
}
```

### Interfaces/
กำหนด "สัญญา" ว่า repository ต้องทำอะไรได้บ้าง  
ไม่สนใจว่าจะ implement ด้วย EF Core, Dapper หรืออะไรก็ตาม

```csharp
public interface IMemberRepository
{
    Task<List<Member>> GetAllAsync();
}
```

---

## 📁 Infrastructure/

**หน้าที่:** ส่วนที่ติดต่อโลกภายนอก — Database, Email, Storage, API ภายนอก

Implement interface ที่ Domain กำหนดไว้  
ถ้าอยากเปลี่ยน database → แก้แค่ที่นี่ที่เดียว

### Persistence/
ตั้งค่า EF Core และ mapping ระหว่าง Entity กับ table ใน MySQL

```csharp
public class AppDbContext : DbContext
{
    public DbSet<Member> Members => Set<Member>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Member>(entity =>
        {
            entity.ToTable("member");           // ชื่อ table ใน MySQL
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Username).HasColumnName("username");
        });
    }
}
```

### Repositories/
Implement interface จาก Domain — ใช้ EF Core จริงๆ ที่นี่

```csharp
public class MemberRepository : IMemberRepository
{
    private readonly AppDbContext _db;
    public MemberRepository(AppDbContext db) => _db = db;

    public async Task<List<Member>> GetAllAsync()
        => await _db.Members.ToListAsync();
}
```

---

## 📁 Extensions/

**หน้าที่:** รวม code ลงทะเบียน service (DI) ไว้ที่เดียว

ทำให้ `Program.cs` สะอาด — เพิ่ม service ใหม่มาแก้แค่ไฟล์นี้

```csharp
public static IServiceCollection AddInfrastructure(
    this IServiceCollection services, IConfiguration config)
{
    // Database
    services.AddDbContext<AppDbContext>(...);

    // Repositories — เพิ่ม feature ใหม่ เพิ่มที่นี่
    services.AddScoped<IMemberRepository, MemberRepository>();

    return services;
}
```

เรียกใช้ใน `Program.cs` แค่บรรทัดเดียว:
```csharp
builder.Services.AddInfrastructure(builder.Configuration);
```

---

## 📁 Middleware/

**หน้าที่:** code ที่ทำงานอัตโนมัติทุก request — ก่อนและหลัง controller รับงาน

ใช้สำหรับ: จับ Exception, Logging, Auth, Rate Limiting

```csharp
public async Task InvokeAsync(HttpContext ctx)
{
    try
    {
        await _next(ctx);   // ปล่อยให้ request ผ่านไปก่อน
    }
    catch (Exception ex)
    {
        // ถ้ามี error ใดๆ ในระบบ จะมาจบที่นี่
        ctx.Response.StatusCode = 500;
        await ctx.Response.WriteAsJsonAsync(new { error = ex.Message });
    }
}
```

---

## 📄 Program.cs

**หน้าที่:** จุดเริ่มต้นของ application — bootstrap ทุกอย่าง

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
builder.Services.AddMediatR(...);
builder.Services.AddInfrastructure(builder.Configuration); // ← Extensions

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
app.Run();
```

---

## 📄 appsettings.json

**หน้าที่:** เก็บ config ทั้งหมด — connection string, logging level, secrets

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Port=3306;Database=myapp_db;User=root;Password=..."
  },
  "Serilog": {
    "MinimumLevel": "Information",
    "WriteTo": [{ "Name": "Console" }]
  }
}
```

> **หมายเหตุ:** ไม่ commit `appsettings.json` ที่มี password จริงขึ้น Git  
> ใช้ `appsettings.Development.json` หรือ Environment Variables แทน

---

## สรุปหน้าที่ในหนึ่งบรรทัด

| Folder | หน้าที่ |
|---|---|
| `Controllers/` | รับ HTTP — ส่งต่อ MediatR |
| `Features/` | Business logic จัดตาม feature |
| `Domain/` | Entity + Interface — ไม่รู้จัก DB |
| `Infrastructure/` | EF Core + MySQL + Implement repos |
| `Extensions/` | ลงทะเบียน DI services |
| `Middleware/` | จัดการ error ทุก request |
| `Program.cs` | Bootstrap app |
| `appsettings.json` | Config ทั้งหมด |
# Frontend-NextJS