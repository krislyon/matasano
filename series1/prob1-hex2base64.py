#
#   Matasano Crypto Challenges
#   Series 1, Problem 1
#   Accept string from the command line and output base64
#
import sys
import base64

hex_data="49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d"
print "Input:\t\t" + hex_data
hex_data = bytearray.fromhex( hex_data )
print "Expected:\tSSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t"
print "Output:\t\t" + base64.b64encode( hex_data )
