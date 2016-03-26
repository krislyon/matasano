import pdb
from series2lib import *

text = "a"
for i in range(100):
    padded = apply_pkcs7_padding( bytearray(text), 16 )
    print ''.join([format(v,'02x') for v in padded ])
    text += "a"

text = "a"
for i in range(50):
    padded = apply_pkcs7_padding( bytearray(text), 16 )
    trimmed = trim_pkcs7_padding( padded )
    print ''.join([format(v,'02x') for v in trimmed ])
    text += "a"
