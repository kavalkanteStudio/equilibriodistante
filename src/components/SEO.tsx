import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string
}

export default function SEO({ title, description, image }: SEOProps) {
  const siteTitle = 'SKOPPOVIC | Decorative Art'
  const siteDescription = 'Curating a unique intersection of digital innovation and traditional aesthetics. Exquisite decorative art for the modern space.'
  const siteUrl = 'https://skoppovic.art' // Placeholder URL

  return (
    <Helmet>
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description || siteDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title ? `${title} | ${siteTitle}` : siteTitle} />
      <meta property="og:description" content={description || siteDescription} />
      <meta property="og:url" content={siteUrl} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | ${siteTitle}` : siteTitle} />
      <meta name="twitter:description" content={description || siteDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
