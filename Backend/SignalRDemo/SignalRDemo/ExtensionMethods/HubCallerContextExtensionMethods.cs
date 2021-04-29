using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

using SignalRDemo.Entities;

using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SignalRDemo.ExtensionMethods
{
    public static class HubCallerContextExtensionMethods
    {
        public static Task<User> GetUserFromContext(this HubCallerContext context, UserManager<User> userManager)
        {
            if (!context.User.Identity.IsAuthenticated)
            {
                return null;
            }
            var userId = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return null;
            }

            return userManager.FindByIdAsync(userId.Value);

        }
    }
}
