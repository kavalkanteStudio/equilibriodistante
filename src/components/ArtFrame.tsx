import './ArtFrame.css'

type ArtFrameOrientation = 'a3-vertical' | 'a3-wide'

type ArtFrameProps = {
  orientation?: ArtFrameOrientation | string | null
  imageUrl: string
  alt: string
}

export default function ArtFrame({ orientation, imageUrl, alt }: ArtFrameProps) {
  const isWide = orientation === 'a3-wide'

  return (
    <div className={`art-frame ${isWide ? 'art-frame--wide' : 'art-frame--vertical'}`}>
      <div className="art-frame__wood art-frame__wood--top" />
      <div className="art-frame__wood art-frame__wood--right" />
      <div className="art-frame__wood art-frame__wood--bottom" />
      <div className="art-frame__wood art-frame__wood--left" />
      <div className="art-paper" />
      <div className="art-frame__mat" aria-hidden="true" />
      <div className="art-frame__art">
        <img className="object-contain" src={imageUrl} alt={alt} />
      </div>
    </div>
  )
}
