package personal.spacesim.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.orekit.data.DataContext;
import org.orekit.data.DataProvidersManager;
import org.orekit.data.DirectoryCrawler;
import java.io.File;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
        // Path to the directory containing Orekit data files
        String orekitDataPath = "/Users/byeonkho/Desktop/personal projs/orekit-data";
        File orekitData = new File(orekitDataPath);
        if (!orekitData.exists() || !orekitData.isDirectory()) {
            logger.error("Orekit data directory not found: {}", orekitDataPath);
            throw new IllegalStateException("Orekit data directory not found: " + orekitDataPath);
        }
        DataProvidersManager manager = DataContext.getDefault().getDataProvidersManager();
        manager.addProvider(new DirectoryCrawler(orekitData));
        logger.info("Orekit data initialized successfully.");
    }

}
