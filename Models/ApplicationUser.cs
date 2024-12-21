using Microsoft.AspNetCore.Identity;

namespace IdZonez.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Add any additional user properties here
        public bool IsAdmin { get; set; }
    }
}
