using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using SignalRDemo.DTOs;
using SignalRDemo.Entities;
using SignalRDemo.ExtensionMethods;
using SignalRDemo.Repositories;

using System.Threading.Tasks;

namespace SignalRDemo.Controllers
{
    [ApiController]
    [Route("api/chat")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _chatRepository;
        private readonly UserManager<User> _userManager;

        public ChatController(IChatRepository chatRepository,
            UserManager<User> userManager
            )
        {
            _chatRepository = chatRepository;
            _userManager = userManager;
        }

        [HttpGet("userchats")]
        public async Task<ActionResult<UserChatsDTO>> GetUserChats()
        {
            var user = await HttpContext.GetUserFromContext(_userManager);
            if (user == null)
            {
                return NotFound();
            }

            return await _chatRepository.GetUserChats(user.Id);

        }


    }
}
