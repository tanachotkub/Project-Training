# 🏗️ โครงสร้าง Backend — Service Layer Pattern

> **Pattern:** Service Layer  
> **Stack:** ASP.NET Core · EF Core · MySQL · Serilog · Swagger  
> **เหมาะกับ:** Project ขนาดกลาง — สมดุลระหว่างความเรียบง่ายและการ scale

---

## โครงสร้าง Folder

```
backend/
├── Controllers/
│   └── MemberController.cs
├── Services/
│   ├── IMemberService.cs
│   └── MemberService.cs
├── Models/
│   ├── Entities/
│   │   └── Member.cs
│   └── DTOs/
│       └── MemberDto.cs
├── Middlewares/
│   └── ExceptionMiddleware.cs
├── AppDbContext.cs
├── appsettings.json
└── Program.cs
```

---

## การไหลของ Request

```
HTTP Request
    ↓
Controllers/        — รับ request เข้ามา
    ↓
Services/           — ประมวลผล business logic
    ↓
AppDbContext        — query MySQL ผ่าน EF Core
    ↓
MySQL Database
```

---

## 📁 Controllers/

**หน้าที่:** รับ HTTP request แล้วส่งต่อให้ Service — ไม่มี logic เอง

```csharp
[ApiController]
[Route("api/[controller]")]
public class MemberController : ControllerBase
{
    private readonly IMemberService _memberService;

    public MemberController(IMemberService memberService)
        => _memberService = memberService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var members = await _memberService.GetAllAsync();
        return Ok(members);
    }
}
```

> Controller รู้จักแค่ `IMemberService` — ไม่แตะ Database โดยตรง

---

## 📁 Services/

**หน้าที่:** Business logic ทั้งหมดอยู่ที่นี่ — Controller และ Database คุยกันผ่าน Service

### `IMemberService.cs` — กำหนดสัญญา

```csharp
public interface IMemberService
{
    Task<List<MemberDto>> GetAllAsync();
}
```

### `MemberService.cs` — ทำงานจริง

```csharp
public class MemberService : IMemberService
{
    private readonly AppDbContext _db;

    public MemberService(AppDbContext db) => _db = db;

    public async Task<List<MemberDto>> GetAllAsync()
    {
        return await _db.Members
            .Select(m => new MemberDto(m.Id, m.Username))
            .ToListAsync();
    }
}
```

> ทำไมต้องมี Interface?  
> — ง่ายต่อการ mock ตอน Unit Test  
> — เปลี่ยน implement ได้โดยไม่แตะ Controller

---

## 📁 Models/

**หน้าที่:** เก็บโครงสร้างข้อมูล แบ่งเป็น 2 ชั้น

### `Entities/Member.cs` — map กับ table ใน MySQL

```csharp
public class Member
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
}
```

### `DTOs/MemberDto.cs` — รูปแบบที่ส่งให้ client

```csharp
public record MemberDto(int Id, string? Username);
// Password ไม่ส่งออกไป — client ไม่ควรเห็น
```

> **Entity** = ตรงกับ DB  
> **DTO** = ตรงกับ client — กรอง field ที่ไม่ควรเปิดเผยออก

---

## 📄 AppDbContext.cs

**หน้าที่:** ตั้งค่า EF Core — map Entity กับ table ใน MySQL

```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Member> Members => Set<Member>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Member>(entity =>
        {
            entity.ToTable("member");                                    // ชื่อ table ใน MySQL
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Username).HasColumnName("username").HasMaxLength(50);
            entity.Property(e => e.Password).HasColumnName("password").HasMaxLength(50);
        });
    }
}
```

---

## 📁 Middlewares/

**หน้าที่:** code ที่ทำงานอัตโนมัติทุก request — จับ Exception ก่อนถึง client

```csharp
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await _next(ctx);           // ปล่อย request ผ่านไปก่อน
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            ctx.Response.StatusCode = 500;
            ctx.Response.ContentType = "application/json";
            await ctx.Response.WriteAsJsonAsync(new
            {
                status = 500,
                message = "Internal Server Error",
                detail = ex.Message
            });
        }
    }
}
```

> ถ้าไม่มี Middleware — error จะส่งออกไปในรูปแบบที่ไม่สวย และอาจเปิดเผย stack trace ให้ client เห็น

---

## 📄 appsettings.json

**หน้าที่:** เก็บ config ทั้งหมด — connection string, log level

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Port=3306;Database=myapp_db;User=root;Password=yourpassword;"
  },
  "Serilog": {
    "MinimumLevel": "Information",
    "WriteTo": [{ "Name": "Console" }]
  },
  "AllowedHosts": "*"
}
```

> ⚠️ อย่า commit password จริงขึ้น Git  
> ใช้ `appsettings.Development.json` หรือ Environment Variables แทน

---

## 📄 Program.cs

**หน้าที่:** จุดเริ่มต้นของ app — ลงทะเบียน service และ middleware ทั้งหมด

```csharp
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((ctx, config) =>
    config.ReadFrom.Configuration(ctx.Configuration));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
var connectionString = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Services — เพิ่ม feature ใหม่ เพิ่มที่นี่
builder.Services.AddScoped<IMemberService, MemberService>();

var app = builder.Build();

// Middleware
app.UseMiddleware<ExceptionMiddleware>();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
```

---

## 📦 Packages ที่ใช้

| Package | หน้าที่ |
|---|---|
| `Pomelo.EntityFrameworkCore.MySql 9.0.0` | เชื่อมต่อ MySQL |
| `Microsoft.EntityFrameworkCore.Tools 9.0.0` | Migration commands |
| `Microsoft.EntityFrameworkCore.Relational 9.0.0` | EF Core base |
| `Serilog.AspNetCore` | Structured logging |
| `Swashbuckle.AspNetCore` | Swagger UI |

---

## สรุปหน้าที่แต่ละส่วน

| ไฟล์/Folder | หน้าที่ |
|---|---|
| `Controllers/` | รับ HTTP — ส่งต่อ Service |
| `Services/` | Business logic ทั้งหมด |
| `Models/Entities/` | โครงสร้างตรงกับ DB |
| `Models/DTOs/` | โครงสร้างที่ส่งให้ client |
| `Middlewares/` | จับ error ทุก request |
| `AppDbContext.cs` | EF Core + MySQL mapping |
| `Program.cs` | Bootstrap + ลงทะเบียน service |
| `appsettings.json` | Config ทั้งหมด |

---

## เปรียบเทียบกับ Pattern อื่น

| | Simple MVC | **Service Layer** | Clean Architecture |
|---|---|---|---|
| Setup | 5 นาที | **15 นาที** | 30+ นาที |
| Business logic อยู่ที่ | Controller | **Service** | Handler |
| Testing | ยาก | **ทำได้** | ง่ายมาก |
| Scale | จำกัด | **ดี** | ดีมาก |
| เหมาะกับ | Prototype | **Project จริง** | Enterprise |