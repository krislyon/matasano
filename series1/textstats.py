def frequency_score( text ):
    score = 0
    textLength = len( text )
    if( textLength ==0 ):
        return 0
    freq = [ 0 for i in range(256) ]
    for b in text:
        freq[b] = freq[b] + 1
    for b in text:
        freq[b] = float(freq[b]) / float(textLength)
    return freq

def alpha_range_score( text ):
    "cleaned up"
    score = 0
    textLength = len( text )
    if ( textLength == 0 ):
         print "textlength is zero"
         return 0
    for b in text:
        if ((b >= 48) and (b <= 57)) or ((b >= 65) and (b <= 90)) or ((b >= 97) and (b <= 122)) or (b==32):
            score+=1
    return float(score) / float(textLength)

def ascii_range_score( text ):
    score = 0
    textLength = len( text )
    if ( textLength == 0 ):
         print "textlength is zero"
         return 0
    for b in text:
        if ( b >= 32 ) and ( b <= 126 ):
            score = score + 1
    return ( float(score) / float(textLength) )


def calculate_hamming_distance( stringOne, stringTwo ):
    "Hamming distance is the difference in bits of the two strings"
    hammingDist = 0
    strOne = map( ord, stringOne )
    strTwo = map( ord, stringTwo )
    # Ensure strings have the same length
    if( len(stringOne) != len(stringTwo) ):
            return -1

    # Iterate through bytes, fine differing bits via XOR,
    # and increment hamming distance for each one.
    for i in range( len(strOne) ):
        b = strOne[i] ^ strTwo[i]
        for j in range(8):
            if( b & 0x01 ):
                hammingDist+=1
            b = b >> 1
    return hammingDist
