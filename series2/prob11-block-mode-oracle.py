from series2lib import *
import random
import itertools

#
#  So long as cipher text is long enough, including a repeating pattern, mode can be detected.
#  Sometimes with a repeating strings much shorter than blocksize
#
#
#

def generate_random_bytearray( length ):
    result = bytearray(length)
    for i in range( length ):
        result[i] = random.randint(0,255)
    return result

def block_is_equal( a, b ):
    if( a == b ):
        return 1
    return 0

def detect_repeating_blocks( ciphertext, block_size ):
    "Search for repeating x size blocks"
    num_blocks = len( ciphertext ) / block_size
    blocks = [""] * num_blocks
    for i in range( num_blocks ):
        block_start = block_size * i
        blocks[i] = ciphertext[ block_start : block_start + block_size ]
    pairs = itertools.combinations( blocks,2 )
    score = sum([ block_is_equal(a,b) for (a,b) in pairs]) / (num_blocks * 1.0)
    return score

def encryption_oracle( user_data, data ):
    # generate random key
    key=generate_random_bytearray(16)
    key=str(key)

    # prepend 5-10 random bytes before plaintext
    # append 5-10 random bytes after plaintext
    prefix = generate_random_bytearray( random.randint(5,10) )
    data[1] = len(prefix)
    postfix = generate_random_bytearray( random.randint(5,10) )
    data[2] = len(postfix)
    plaintext = prefix + user_data + postfix

    # cbc or ecb?  I'll never tell
    if random.randint(1,2) == 1:
        #ECB
        data[0]=1
        ciphertext = encrypt_aes128_ecb( str(plaintext), key )

    else:
        #CBC
        data[0]=2
        iv = generate_random_bytearray( 16 )
        ciphertext = encrypt_aes128_manual_cbc( plaintext, key, iv )

    return ciphertext


#input_string = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
input_string = "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf"
data = [1,2,3]
for i in range(50):
    result = encryption_oracle( input_string, data )
    score = detect_repeating_blocks( result, 16 )
    print  "Score: " + str(score) + ", Pad: " + str(data[1]) + ", " + str(data[2]) + " mode: " + str(data[0]) + "\t\t" + convert_array_to_hex( result )
