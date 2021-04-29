using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using SignalRDemo.DTOs;
using SignalRDemo.Entities;
using SignalRDemo.Services;

using System.Threading.Tasks;

namespace SignalRDemo.Controllers
{
    [ApiController]
    [Route("api/accounts")]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IUserClaimsService _userClaimsService;
        private readonly IJwtBearerService _jwtBearerService;

        public AccountsController(UserManager<User> userManager,
            SignInManager<User> signInManager,
            IUserClaimsService userClaimsService,
            IJwtBearerService jwtBearerService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _userClaimsService = userClaimsService;
            _jwtBearerService = jwtBearerService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<JwtResponse>> Login(LoginDTO loginDTO)
        {
            var user = await _userManager.FindByEmailAsync(loginDTO.Email);
            if (user != null)
            {
                var sigInResult = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, true);
                if (sigInResult.Succeeded)
                {
                    return await GetJwt(user);
                }
            }

            ModelState.AddModelError("InvalidCreds", "Invalid Credentials");
            return BadRequest(ModelState);
        }

        [HttpPost("register")]
        public async Task<ActionResult<JwtResponse>> Register(RegisterDTO registerDTO)
        {
            var user = new User
            {
                UserName = registerDTO.UserName,
                Email = registerDTO.Email
            };
            var sigInResult =await _userManager.CreateAsync(user, registerDTO.Password);
            if (sigInResult.Succeeded)
            {
                    return await GetJwt(user);
                
            }

           foreach(var error in sigInResult.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return BadRequest(ModelState);
        }

        private async Task<JwtResponse> GetJwt(User user)
        {

            var userClaims = await _userClaimsService.GetUserLoginClaims(user);
            return _jwtBearerService.GetJwt(userClaims);

        }
    }
}
