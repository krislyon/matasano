#
# Byte-at-a-time ECB Decryption - Matasano Challenge: Set 2, Problem 12
#
from series2lib import *
import base64
import pdb
import itertools

def encrypt( chosen_plaintext ):
    key="YELLOW SUBMARINE"
    unknown_text = ("Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkg"
                    "aGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBq"
                    "dXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUg"
                    "YnkK" )
    unknown_text = base64.b64decode( unknown_text )
    plaintext = chosen_plaintext + unknown_text
    ciphertext = encrypt_aes128_ecb( str(plaintext), key )
    return ciphertext

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

def decrypt_message():

    msg_pt=""
    block_map={}
    ciphertext = encrypt( "" )
    block_count = len(ciphertext) / 16
    print "Block Count: " + str(block_count)
    chosen_plaintext = "aaaaaaaaaaaaaaa"


    for bc in range(0, block_count ):

        print "-------------" + str(bc) + "-----------"
        block_pt=""
        pad_chrs=""

        pdb.set_trace()


        for j in range(0,16):
            block_map.clear()

            # Generate Block Map for byte
            for i in range(0,256):
                    if( len(pad_chrs) == 0 ):
                        ciphertext = encrypt( chosen_plaintext + block_pt + chr(i) )
                        block_map[ convert_array_to_hex(ciphertext[0:16]) ] = i
                    else:
                        pad_chr = 16 - len( chosen_plaintext ) - len( block_pt )
                        padding = [ chr(pad_chr) for q in range(pad_chr-1)]
                        ciphertext = encrypt( chosen_plaintext + block_pt + ''.join(padding) + chr(i) )
                        #print "PAD1(" + str(i) +"): " + convert_array_to_hex( ciphertext[0:16] ) + ", " + convert_array_to_hex( bytearray(padding) )
                        block_map[ convert_array_to_hex(ciphertext[0:16]) ] = i

                        ciphertext = encrypt( chosen_plaintext + block_pt + pad_chrs + chr(i) )
                        #print "PAD2: " + convert_array_to_hex( ciphertext[0:16] ) + ", " + convert_array_to_hex( bytearray(padding) )
                        block_map[ convert_array_to_hex(ciphertext[0:16]) ] = i


            # Generate Block Map entries for possible padding
#            temp = chosen_plaintext + block_pt
#            for k in range(0,16 - pad_start):
#            temp[pad_start+k] = pad_value
#            block_map[ convert_array_to_hex( encrypt( temp[i:16] + bytearray([i]*i)) )] = i



            #pdb.set_trace()

            # Determine last byte in block
            try:
                ciphertext = encrypt( chosen_plaintext )
                last_byte = block_map[ convert_array_to_hex(ciphertext[ (16*bc) : (16*bc)+16 ]) ]

                if( last_byte >= 1 and last_byte <= 0x10 ):
                    pad_chrs += chr(last_byte)
                    print "last_byte: " + str(last_byte) + ", appending to pad_chrs: " + str(pad_chrs)
                elif( len(pad_chrs) > 0 ):
                    block_pt += pad_chrs
                    block_pt += chr(last_byte)
                    pad_chrs = ""
                    print "last_byte: " + str(last_byte) + ", cleared pad_chrs: " + str(pad_chrs)
                else:
                    block_pt += chr(last_byte)

                print format( j, "02x" ) + " : " + convert_array_to_hex(ciphertext[ (16*bc) : (16*bc)+16 ]) + " : \'" + chr(last_byte) + "\' (" + format( last_byte, "02x") + ")"
            except KeyError:
                block_pt += "?"
                print format( j, "02x" ) + " : UNKNOWN"

            # Advance to next byte in block
            chosen_plaintext = chosen_plaintext[1:16]

        msg_pt += block_pt
        chosen_plaintext = block_pt[1:16]

    return msg_pt


# Step 1: Detect Cipher Mode - It's ECB, but lets make sure :)
#
#   Repeating blocks are detected..... so it's very likely an ECB cipher.
#
ciphertext = encrypt( "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" )
for bs in range( 2, 20 ):
    score = detect_repeating_blocks( ciphertext, bs )
    print "Blocksize: " + str(bs) + ", Score: " + str(score)

# Step 2: Determine Blocksize - It's 16, but lets verify.
#
#   Initial block is fixed at chosen, repeating texts equal to and greater than size 16
#
chosen_plaintext = "a"
for i in range(34):
    print chosen_plaintext + " : " + convert_array_to_hex( encrypt( chosen_plaintext )[0:60] ) + "..."
    chosen_plaintext += "a"

# Step 3:
#
print "Block PT: "
print decrypt_message()
