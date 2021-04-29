using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

using SignalRDemo.DTOs;

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SignalRDemo.Services
{
    public class JwtBearerService : IJwtBearerService
    {
        private readonly IConfiguration _configuration;

        public JwtBearerService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        private byte[] IssuerSiginKey
        {
            get
            {
                return Encoding.UTF8.GetBytes(_configuration["jwt:token"]);
            }
        }
        
        public JwtResponse GetJwt(IEnumerable<Claim> claims)
        {
            var sigInKey = new SymmetricSecurityKey(IssuerSiginKey);
            var sigInCredentials = new SigningCredentials(sigInKey, SecurityAlgorithms.HmacSha256);


            var expiration = DateTime.Now.AddMinutes(60);

            var tokenBuilder = new JwtSecurityToken(
                issuer: null,
                audience: null, 
                claims,DateTime.Now, 
                expiration,
                sigInCredentials);

            return new JwtResponse()
            {
                Expiration = expiration,
                Token = new JwtSecurityTokenHandler().WriteToken(tokenBuilder)
            };
        }
    }
}
