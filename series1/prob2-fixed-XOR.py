#
#  Fixed XOR, Matasano Challenge: Set 1, Problem 2
#
import sys
import base64
import cipher_xor

key =        "686974207468652062756c6c277320657965"
input_data = "1c0111001f010100061a024b53535009181c"

print "Input:\t\t" + input_data
print "XOR Key:\t" + key

input_data = bytearray.fromhex(input_data)
key = bytearray.fromhex(key)

cipher_text = cipher_xor.encrypt_otp_xor( input_data, key )

output_string = ''.join([format(v,'02x') for v in cipher_text])
print "Output:\t\t" + output_string
