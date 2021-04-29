using SignalRDemo.DTOs;

using System.Collections.Generic;
using System.Security.Claims;

namespace SignalRDemo.Services
{
    public interface IJwtBearerService
    {
        public JwtResponse GetJwt(IEnumerable<Claim> claims);

    }
}
