import Image from "next/image";

export interface CardImageProps {
  description: string;
  image: string;
  title: string;
}

const CardImage: React.FC<CardImageProps> = ({ description, image, title }) => {
  return (
    <div className="flex flex-col h-full w-full border border-grey rounded-lg overflow-hidden">
      <div
        className="h-[216px] bg-[#FCFCFD] border-b flex justify-center items-center"
        style={{ borderBottom: "none" }}
      >
        <Image
          alt={title}
          className="w-auto h-[180px] max-w-full object-contain"
          height={0}
          sizes="100vw"
          src={image}
          width={0}
        />
      </div>
      <div
        className="flex flex-col grow p-8 pb-0"
        style={{ borderTop: "none" }}
      >
        <h5>{title}</h5>
        <p className="fr-text--sm">{description}</p>
      </div>
    </div>
  );
};

export default CardImage;
