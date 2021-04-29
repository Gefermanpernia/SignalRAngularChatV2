using System.ComponentModel.DataAnnotations;

namespace SignalRDemo.DTOs
{
    public class AuthenticationBaseDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password{ get; set; }
    }
}
