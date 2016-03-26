import sys
import pdb
import base64
import cipher_xor
import textstats
import convert
import itertools

MAX_KEYSIZE=40

def test_keysize( key_size, text ):
    strings = ["","","",""]
    for i in range(key_size):
        strings[0] = strings[0] + text[i]
        strings[1] = strings[1] + text[i+key_size]
        strings[2] = strings[2] + text[i+(key_size*2)]
        strings[3] = strings[3] + text[i+(key_size*3)]

    pairs = itertools.combinations(strings,2)
    hamming_distance = sum( [textstats.calculate_hamming_distance(a,b) for (a,b) in pairs])

    return hamming_distance * 1.0 / key_size

def determine_block_key( block ):
    max_score = max_score_key = 0
    for k in range(0,256):
        text = cipher_xor.encrypt_singlebyte_xor( bytearray(block), k )
        score = textstats.alpha_range_score( text )
        if( max_score < score ):
            max_score = score
            max_score_key = k
    return max_score_key


# Load Encrypted File
print "Reading input file data."
with open("prob6-XOR-encrypted-file.txt", "r") as f:
    ciphertext = f.read()


# Decode Base 64
print "Base64 decoding ciphertext."
ciphertext = base64.b64decode( ciphertext )


# Determine probable keysize via average hamming
print "Calculating probable keysize..."
min_hamm = MAX_KEYSIZE * 8
key_size = 0

for k in range(1,MAX_KEYSIZE):
    avg_hamm = test_keysize( k, ciphertext )
    if( avg_hamm < min_hamm ):
        min_hamm = avg_hamm
        key_size = k
print "\tLikely Keysize: " + str(key_size)

# Create text blocks via key size
print "Determining Key"
print "\tSplitting ciphertext into blocks"
j=0
cipher_text_block = [""] * key_size
for k in ciphertext:
    cipher_text_block[j] = cipher_text_block[j] + k
    j+=1
    if j >= key_size:
        j = 0

# Apply histograms to each to find most probably key characters
print "\tCalculating likely key for block"
block_key_value = [""] * key_size
for b in range(len(cipher_text_block)):
    block_key_value[b] = determine_block_key( cipher_text_block[b] )

key= convert.convert_array_to_ascii( block_key_value )
print "\tLikely key determined to be: \"" + key + "\""

# Decrypt
plaintext = cipher_xor.encrypt_rotating_xor( bytearray(ciphertext), bytearray(key) )

print "\n\n\n"
print "***** BEGIN DECRYPTED TEXT *****"
print "\n"
print convert.convert_array_to_ascii( plaintext )
print "\n"
print "***** END DECRYPTED TEXT *****"
print "\n"
