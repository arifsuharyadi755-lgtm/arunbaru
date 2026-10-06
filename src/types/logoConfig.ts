export type LogoStyle = 
  | 'graffiti_3d_glow'    // Huruf Grafiti 3D Menyala (Signature Default)
  | 'graffiti_modern'     // Grafiti Modern Elegan
  | 'graffiti_tag'        // Grafiti Street Tag Dinamis
  | 'editorial_bold'      // Editorial Modern Bold
  | 'calligraphy_brush'   // Kuas Kaligrafi Nusantara
  | 'neon_glow'           // Neon Cyber Glow
  | 'custom_image';       // Unggah Gambar / URL Logo Sendiri

export type LogoColorTheme = 
  | 'amber_gold'    // Emas & Kuning Arun (Default)
  | 'cyan_electric' // Biru Elektrik & Cyan
  | 'flame_red'     // Merah Api & Putih
  | 'emerald_green';// Hijau Zamrud & Emas

export interface LogoSettings {
  style: LogoStyle;
  colorTheme: LogoColorTheme;
  textArun: string;
  textNews: string;
  tagline: string;
  showTagline: boolean;
  showCrown: boolean;
  showUnderline: boolean;
  customImageUrl?: string;
}

export const DEFAULT_LOGO_SETTINGS: LogoSettings = {
  style: 'graffiti_3d_glow',
  colorTheme: 'amber_gold',
  textArun: 'ARUN',
  textNews: 'NEWS',
  tagline: 'Jembatan Informasi Nusantara',
  showTagline: true,
  showCrown: true,
  showUnderline: true
};
