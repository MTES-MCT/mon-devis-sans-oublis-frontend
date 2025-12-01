import Image from "next/image";

export interface CardProps {
  children: React.ReactNode;
  image?: string;
  title: string;
}

const Card: React.FC<CardProps> = ({ children, image, title }) => {
  return (
    <div className="border-grey rounded-lg px-6 pt-8 pb-6 bg-white">
      <h5>{title}</h5>
      {children}
      {image && (
        <div className="relative w-[200px] md:w-[300px] lg:w-[400px] h-[100px]">
          <Image
            alt="Ministère de la Transition Écologique"
            className="object-contain object-left"
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 300px, 200px"
            src="/images/ministere_transition_ecologique.webp"
          />
        </div>
      )}
    </div>
  );
};

export default Card;
