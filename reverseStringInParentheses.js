
function reverse (s) {
    let stack = []
    let q = []
    for(let i = 0; i < s.length; i++) {
        if(s[i] == ')') {
            while(stack.length != 0 && stack[stack.length-1] != '(') {
                q.push(stack.pop())
            }
            if(stack.length != 0) {
                stack.pop()
            }
            while(q.length != 0) {
                stack.push(q.shift())
            }
        }
        else {
            stack.push(s[i])
        }
    }

    return stack.join('')
}

let s = "a(foo(bar)b(noey)c)"
console.log(reverse(s))