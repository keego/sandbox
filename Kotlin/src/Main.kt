/**
 * Created by keegomyneego on 1/28/18.
 */

fun printNTimes(n: Int, getText: () -> String) {
    for (i in 1..n) {
        val text = getText()
        println("$i : $text")
    }
}

fun main(args: Array<String>) {
    printNTimes(3, { "Hello World!" })
}