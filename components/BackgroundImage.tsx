import Image from "next/image";

const BackgroundImage = () => {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 -z-10">
      <Image
        src="/images/bg.png"
        alt="background"
        fill
        className="object-cover"
      />
    </div>
  );
};
export default BackgroundImage;
