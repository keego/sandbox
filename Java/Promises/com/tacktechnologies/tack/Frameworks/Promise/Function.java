package com.tacktechnologies.tack.Frameworks.Promise;

/**
 * Created by keegomyneego on 10/27/16.
 */

public abstract class Function<A, R> {

    public abstract R call(A args);

    public DeferredFunction<A, R> defer(A argument) {
        return new DeferredFunction<>(argument, this);
    }
}
