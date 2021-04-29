using SignalRDemo.Entities;

using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SignalRDemo.Services
{
    public interface IUserClaimsService
    {
        Task<IEnumerable<Claim>> GetUserLoginClaims(User user);
    }
}
