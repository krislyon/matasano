import sys
import pdb
import cipher_xor
import convert
import textstats

maxTextId=0
maxKey=0
maxScore=0
maxPlain=""
maxCiphertext=""
textId=0
res=""

f = open("prob4-xor-byte-text.txt", "r")
for line in f:

    print "Processing text with id: " + str(textId)
    ciphertext = convert.convert_hex_to_array( line )

    for key in range(0,256):
        res = cipher_xor.encrypt_singlebyte_xor( ciphertext, key )
        print convert.convert_array_to_hex( res ) + ", " + format(key,'02x') + "\t\t\t\t" + convert.convert_array_to_hex( ciphertext )
        lscore = textstats.alpha_range_score( res )

        if( lscore > 0.80 ):
            print "\ttextId: " + str(textId)+ ", key: " + str(key) + ", score: " + str(lscore) + "\t\t[" + str(res) + "]"

        if( lscore > maxScore ):
            print "***** Setting Maximums *****"
            maxTextId = textId
            maxScore = lscore
            maxCiphertext = ciphertext
            maxKey = key
            maxPlain = res

    textId = textId + 1

print "maxTextId: " + str(maxTextId) + ", maxKey: " + str(maxKey) + ", maxScore: " + str(maxScore)
print "maxCiphertext: " + convert.convert_array_to_hex( maxCiphertext )
print "result (hex):  " + convert.convert_array_to_hex( res )
print "result (ascii):" + convert.convert_array_to_ascii( maxPlain )
