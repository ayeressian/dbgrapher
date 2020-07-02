declare module 'avatar-initials' {
  const content: string;

  type Options = {
    useGravatar: boolean; // Allow Gravatars or not.
    fallbackImage: string; // URL or Data URI used when no initials are provided and not using Gravatars.
    size: number;          // Size in pixels, fallback for hidden images and Gravatar
   
    // Initial Avatars Specific
    initials: string;          // Initials to be used.
    initial_fg: string; // Text Color #888888
    initial_bg: string; // Background Color #f4f6f7
    initial_size: number;    // Text Size in pixels
    initial_weight: number;   // Font weight (numeric value for light, bold, etc.)
    initial_font_family: string; //"'Lato', 'Lato-Regular', 'Helvetica Neue'"
   
    // Gravatar Specific
    hash: string;                   // Precalculated MD5 string of an email address
    email: string;                  // Email used for the Gravatar
    fallback: string;               // Fallback Type 'mm'
    rating: string;                  // Gravatar Rating 'x'
    forcedefault: boolean;          // Force Gravatar Defaults
    allowGravatarFallback: boolean; // Use Gravatars fallback, not fallbackImage
   
    // GitHub Specific
    github_id: string;  // GitHub User ID.
   
    // Avatars.io Specific
    use_avatars_io: boolean; // Enable Avatars.io Support
    avatars_io: {
      user_id: string;       // Avatars.io User ID
      identifier: string;    // Avatars.io Avatar Identifier
      twitter: string;       // Twitter ID or Username
      facebook: string;      // Facebook ID or Username
      instagram: string;     // Instagram ID or Username
      size: string;      // Size: small, medium, large
    };
   
    setSourceCallback: () => void; // Callback called when image source is set (useful to cache avatar sources provided by third parties such as Gravatar)
  }
  class Avatar {
    constructor(el: Element, options: Options);
  }
  export default Avatar;
}
