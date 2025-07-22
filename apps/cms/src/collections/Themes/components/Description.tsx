import styles from "./Description.module.scss";

const Description = () => {
    return (
        <p className="field-description">
            Choose the editor mode for your storefront.
            <a
                href="https://docs.shopnex.ai/design/overview"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
            >
                Learn more
            </a>
        </p>
    );
};

export default Description;
