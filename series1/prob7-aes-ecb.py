#
# Break Single Byte XOR - Matasano Challenge: Set 1, Problem 7
#
import base64
from Crypto.Cipher import AES


key = "YELLOW SUBMARINE"

# Load Encrypted File
print "Reading input file data."
with open("prob7-aes-ecb-encrypted-file.txt", "r") as f:
    ciphertext = f.read()

# Decode Base 64
print "Base64 decoding ciphertext."
ciphertext = base64.b64decode( ciphertext )

# decrypt text
print "Decrypting AES-128 in ECB mode:"
cipher = AES.new( key )
plaintext = cipher.decrypt( ciphertext )

print plaintext
