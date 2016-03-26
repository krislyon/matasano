#
# Break Single Byte XOR - Matasano Challenge: Set 1, Problem 2
#
import sys
import pdb
import cipher_xor
import textstats

cipher_text = "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736"

print "Ciphertext:\t\t" + cipher_text
cipher_text = bytearray.fromhex(cipher_text)

for key in range(0,255):
    res = cipher_xor.encrypt_singlebyte_xor( cipher_text, key )
    score = textstats.alpha_range_score( res )
    if( score > 0.95 ):
        print "key: " + str(key) + ", score: " + str(score) + " [" + res + "]"
