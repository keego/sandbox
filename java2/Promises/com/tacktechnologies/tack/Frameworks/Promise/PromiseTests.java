package com.tacktechnologies.tack.Frameworks.Promise;

import com.tacktechnologies.tack.Frameworks.Promise.*;

/**
 * Created by keegomyneego on 10/28/16.
 */

public class PromiseTests {

    public static void main(String[] args) {
        System.out.println("V-- Begin Tests --V\n");

        generalTest();
        System.out.println("\n^-- Ended Tests --^");
    }

    static void generalTest() {
        System.out.println("Hello World!");

        Promise.runAsync(new Function<Void, String>() {
            @Override
            public String call(Void args) {
                System.out.println("Function called!");
            }
        })
        .begin();

        System.out.println(arg.value);
    }
}
