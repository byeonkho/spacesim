package personal.spacesim.orekit;

import org.orekit.data.DataContext;
import org.orekit.data.DataProvidersManager;
import org.orekit.data.DirectoryCrawler;

import java.io.File;

public class OrekitInit {

    //TODO orekit should be initialized on app start, responsibility should not be left to frame class

    private static boolean initialized = false;

    private OrekitInit() {
        // Private constructor to prevent instantiation
    }

    public static synchronized void initializeOrekit() {
        if (!initialized) {
            // Path to the directory containing Orekit data files
            String orekitDataPath = "/Users/byeonkho/Desktop/personal projs/orekit-data";
            File orekitData = new File(orekitDataPath);
            DataProvidersManager manager = DataContext.getDefault().getDataProvidersManager();
            manager.addProvider(new DirectoryCrawler(orekitData));
            initialized = true;
        }
    }
}



