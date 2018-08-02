package com.tacktechnologies.tack.Frameworks.Promise;

import com.tacktechnologies.tack.Frameworks.Promise.Function;

/**
 * Created by keegomyneego on 10/28/16.
 */

public class DeferredFunction<Arg, Result> {
    private Arg argument;
    private Function<Arg, Result> function;

    public DeferredFunction(Arg argument, Function<Arg, Result> function) {
        this.argument = argument;
        this.function = function;
    }

    public Result call() {
        return this.function.call(this.argument);
    }
}
