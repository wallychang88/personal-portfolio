/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the site can be hosted on any static target:
  // Vercel, Netlify, GitHub Pages, S3 + CloudFront, even a USB stick.
  // To switch back to a Node server, delete this `output` line.
  output: 'export',
  images: {
    // Required for static export; we don't use Next's image optimizer.
    unoptimized: true,
  },
  // Trailing slashes make GitHub Pages-style hosting nicer.
  trailingSlash: true,
};

export default nextConfig;
