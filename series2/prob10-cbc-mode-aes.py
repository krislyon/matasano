#
# Implement CBC mode AES - Matasano Challenge: Set 2, Problem 10
#
import pdb
import base64
from series2lib import *

key="YELLOW SUBMARINE"
iv=bytearray(b'\x00' * 16)

# Load Encrypted File
print "Reading input file data."
with open("prob10-aes-cbc-file.txt", "r") as f:
    ciphertext = f.read()

# Decode Base 64
print "Base64 decoding ciphertext."
ciphertext = base64.b64decode( ciphertext )


# decrypt text
print "Decrypting AES-128 in CBC mode (manually): "
plaintext = decrypt_aes128_manual_cbc( bytearray(ciphertext), key, iv )
print plaintext
