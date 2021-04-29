using Microsoft.AspNetCore.Identity;

using SignalRDemo.Entities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SignalRDemo.Services
{
    public class UserClaimsService : IUserClaimsService
    {
        private readonly UserManager<User> _userManager;

        public UserClaimsService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        public async Task<IEnumerable<Claim>> GetUserLoginClaims(User user)
        {
            if (user==null )
            {
                throw new ArgumentNullException(nameof(user), $"User can't be null");
            }

            var userRoles =await _userManager.GetRolesAsync(user);

            var userClaims = userRoles.Select(r => new Claim(ClaimTypes.Role, r));

            userClaims = userClaims.Append(new Claim(ClaimTypes.NameIdentifier, user.Id));


            return userClaims;

        }
    }
}
