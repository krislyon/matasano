#
#  Repeating Key XOR - Matasano Challenge: Set 1, Problem 5
#
import sys
import pdb
import convert
import cipher_xor


key_string=bytearray("ICE")
plain_text=bytearray("Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal")
cipher_text = cipher_xor.encrypt_rotating_xor( plain_text, key_string )
print convert.convert_array_to_hex( cipher_text )
result = cipher_xor.encrypt_rotating_xor( cipher_text, key_string )
print convert.convert_array_to_ascii( result )
