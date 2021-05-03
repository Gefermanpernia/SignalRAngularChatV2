using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using SignalRDemo.Entities;
using SignalRDemo.Hubs;
using SignalRDemo.Repositories;
using SignalRDemo.Services;

using System;
using System.Runtime;
using System.Text;
using System.Threading.Tasks;

namespace SignalRDemo
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
                 {

                     options.TokenValidationParameters = new TokenValidationParameters
                     {
                         ValidateAudience = false,
                         ValidateIssuer = false,
                         ValidateIssuerSigningKey = true,
                         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["jwt:token"])),
                         ClockSkew = TimeSpan.Zero,
                         ValidateLifetime = true,
                         SaveSigninToken = true
                     };

                     options.Events = new JwtBearerEvents
                     {
                         OnMessageReceived = (context) =>
                         {
                             //headers 
                             //Authorization Bearer {token}
                             if (context.Token == null)
                             {
                                 if (context.HttpContext.Request.Query.ContainsKey("access_token"))
                                 {
                                     context.Token = context.HttpContext.Request.Query["access_token"];
                                 }
                             }

                             return Task.CompletedTask;
                         }
                     };
                 });

            services.AddIdentity<User, IdentityRole>(options =>
            {
                options.User.RequireUniqueEmail = true;
            })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddSingleton<IJwtBearerService, JwtBearerService>();
            services.AddScoped<IUserClaimsService, UserClaimsService>();
            services.AddAutoMapper(typeof(Startup));
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "SignalRDemo", Version = "v1" });
            });

            var corsPolicyBuilder = new CorsPolicyBuilder()
                .WithOrigins("http://localhost:4200", "https://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
            services.AddCors(options =>
            {
                options.AddPolicy("Development", corsPolicyBuilder.Build());
            });
            services
                .AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("default")));

            services.AddScoped<IChatRepository, ChatRepository>();

            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SignalRDemo v1"));
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("Development");
            
            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chathub");
            });
        }
    }
}
