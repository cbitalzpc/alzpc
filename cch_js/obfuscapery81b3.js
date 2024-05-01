/*******************************
********   OBFUSCAPERY   *******
********************************
* Version 1.10                 *
* (c)2011 Lilaea Media LLC     *
********************************
************************************************************************************
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
DAMAGE.
***********************************************************************************/


/***** PUT ME IN YOUR JS INCLUDE FOLDER AND POINT THE HTML SCRIPT SRC TAG AT ME ****/
$(document).ready(function(e) {    
    $(document).mousemove(isHuman); // requires a mouse move to load email address
    $(document).on("touchstart", isHuman());  // Will fire the function on mobile devices, may require jQuery update
});

function isHuman(e) { // handles mouse move event, assumes must be human

    $(document).unbind('mousemove'); // unbind mouse event
    var descriptor = '#obfu_x'; // change this 
    var hex = $(descriptor).text();
    
    if (hex != '' && hex != null) {
    
        var res;
        $.ajax({ // post back to php to get decrypt key and count
        /*EDIT ME* CHANGE URL TO THE ACTUAL LOCATION OF THIS INCLUDE ON YOUR SERVER vvv**/
            url: 'cch_js/obfuscapery.inc.php',
        /*EDIT ME* CHANGE URL TO THE ACTUAL LOCATION OF THIS INCLUDE ON YOUR SERVER ^^^**/
            data: { 
                token: hex
            }, // pass token
            type: 'POST', // only works on post data
            error: function() { 
                return; 
            }, // bail on error
            success: function(response) { // get params 
                res = response;
            },
            complete: function() { // gracefully replace each link with mailto link
                replaceEmailLinks(res);
            }
        });
    }
}

function replaceEmailLinks(res) {
    $.ajax({
        url: 'cch_js/resolve_domain.php',
        data: { 
            host: document.location.host
        },
        type: 'POST',
        success: function(response) { // get params 
            var dec = xor_dec(res, response).split("\t"); // host must match to decode
            var secret = dec.shift();
            var count = dec.shift();
            var prefix = dec.shift();
            for (e = 0; e < count; e++) {
                var email = $('#' + prefix + e).text(); // get encrypted email address from div
                
                if (email != '' && email != null) {
                    var selector = 'mailto_' + e;
                    email = xor_dec(email, secret).split("\t");
                    swapMailTo(selector, email[1]);
                }
            }
        },
        error: function() { 
            return; 
        }
    });
}

function swapMailTo(selector, email) 
{
    /*EDIT ME* MODIFY THIS OUTPUT TO SUIT YOUR NEEDS vvv**/
    var mailto = '<a href="mailto:' + email + '">' + email + '</a>'; // customize this
    /*EDIT ME* MODIFY THIS OUTPUT TO SUIT YOUR NEEDS ^^^**/
    $("[id=" + selector + "]").fadeOut('slow', function(e) { $(this).html(mailto).fadeIn('slow'); } );
}

function xor_dec(hex, key)
{
    if (hex.length == 0 || key.length == 0) return; // verify input exists
    while (key.length < hex.length) key += key; // pad key to >= hex
    var string = ''; // initialize result string
    for(p = 0; p < hex.length; p += 2) 
    { // iterate through input string two chars at a time
        var h = hex.charAt(p) + hex.charAt(p + 1); // get next two hex chars
        var b = parseInt(h, 16); // convert to decimal
        var k = key.charCodeAt(p / 2); // get ascii value of corresponding key
        var c = String.fromCharCode(b ^ k); // get ascii char from xor bitwise conversion
        string += c; // add to result string
    }
    return string;
}
