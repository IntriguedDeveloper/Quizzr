import Image from "next/image";
import styles from "./Card.module.css";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
export default function Card({
  cardHeading,
  icon,
  onClick,
}: {
  cardHeading: string;
  icon: StaticImport;
  onClick?: () => void;
}) {
  return (
    <>
      <div className={styles.cardContainer} onClick={onClick}>
        <Image src={icon} alt="cardIcon"></Image>
        <a>{cardHeading}</a>
      </div>
    </>
  );
}
