#
# Detect AES-ECB - Matasano Challenge: Set 1, Problem 8
#
import sys
import pdb
import itertools
import convert
import base64
from Crypto.Cipher import AES

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



# Load Encrypted File
print "Reading ciphertexts from file."
with open("prob8-detect-aes-ecb.txt", "r") as f:
    cipher_texts = f.readlines()

# Process texts
max_score = 0.0
max_text = ""
for text in cipher_texts:
    score = detect_repeating_blocks(  convert.convert_hex_to_array( text ), 16 )
    if( score > max_score ):
        score = max_score
        max_text = text

print "Result:"
print max_text
