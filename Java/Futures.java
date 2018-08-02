import java.util.*;
import java.util.concurrent.*;

public class Playground {
    public static void main(String[] args) {
        System.out.println("V-- Begin Playground --V\n");

        // 1 - build the task
        Runnable r = new Runnable() {
            @Override
            public String run() {
                System.out.println("Starting Future");
                Thread.sleep(1000);

                return "Returned Future Value";
            }
        };

        CompletableFuture<String> retrieveName = CompletableFuture.runAsync(r);

        // 2 - start the task
        retrieveName.run();

        // 3 - collect the result
        try {
            System.out.println("retrieveName.get() 1");
            System.out.println(retrieveName.get());
            System.out.println(retrieveName.get());
            System.out.println("retrieveName.get() 2");
        } catch (InterruptedException | ExecutionException ex) {
            throw new RuntimeException(ex);
        }

        System.out.println("\n^--  End Playground  --^");
    }
}
