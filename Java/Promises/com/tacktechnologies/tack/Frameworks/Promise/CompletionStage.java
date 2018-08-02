package com.tacktechnologies.tack.Frameworks.Promise;

/**
 * Created by keegomyneego on 10/27/16.
 */

public class CompletionStage<ValueType, ErrorType> {

    ValueType value = null;
    ErrorType error = null;

    private CompletionStage() {}

    static <E> CompletionStage<Void, E> makeStageWithError(E error) {
        return CompletionStage.makeStage(null, error);
    }

    static <V> CompletionStage<V, Void> makeStageWithValue(V value) {
        return CompletionStage.makeStage(value, null);
    }

    static <V, E> CompletionStage<V, E> makeStage(V value, E error) {
        CompletionStage<V, E> stage = new CompletionStage<>();
        stage.value = value;
        stage.error = error;

        return stage;
    }
}
