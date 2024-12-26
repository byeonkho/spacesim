package personal.spacesim.config;

import jakarta.annotation.PostConstruct;
import org.orekit.data.DataContext;
import org.orekit.data.DataProvidersManager;
import org.orekit.data.DirectoryCrawler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import java.io.File;

@Configuration
@ComponentScan(basePackages = "personal.spacesim")
public class AppConfig {

    private static final Logger logger = LoggerFactory.getLogger(AppConfig.class);

    /**
     * Initializes Orekit at start
     */
    @PostConstruct
    public void initializeOrekit() {
        logger.info("Initializing Orekit data...");

        // Locate Orekit data from the classpath
        String orekitDataPath = "orekit-data-master";
        File orekitData;
        try {
            orekitData = new File(getClass().getClassLoader().getResource(orekitDataPath).toURI());
        } catch (Exception e) {
            logger.error("Error locating Orekit data in the classpath: {}", orekitDataPath, e);
            throw new IllegalStateException("Orekit data directory not found in the classpath: " + orekitDataPath, e);
        }

        if (!orekitData.exists() || !orekitData.isDirectory()) {
            logger.error("Orekit data directory not found: {}", orekitData.getAbsolutePath());
            throw new IllegalStateException("Orekit data directory not found: " + orekitData.getAbsolutePath());
        }

        DataProvidersManager manager = DataContext.getDefault().getDataProvidersManager();
        manager.addProvider(new DirectoryCrawler(orekitData));
        logger.info("Orekit data initialized successfully from classpath.");
    }


}
