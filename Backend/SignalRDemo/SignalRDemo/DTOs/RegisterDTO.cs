using System.ComponentModel.DataAnnotations;

namespace SignalRDemo.DTOs
{
    public class RegisterDTO : AuthenticationBaseDTO
    {
        [Required]
        [MinLength(4)]
        public string UserName { get; set; }
    }
}
