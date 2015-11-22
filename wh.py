from hodclient import *

hodClient = HODClient("a0daabb0-7b7f-4b9d-a8a7-6d4e75a50cf5")
word_dict = dict()
resp = ""

def to_dict(text):
    words = str(text).split()
    #word_dict = dict()
    for word in words:
        if word not in word_dict:
            word_dict[word] = 0
        word_dict[word] += 1
    #print word_dict

# callback function
def asyncRequestCompleted(jobID, error):
    if error != None:
        for err in error.errors:
            result = "Error code: %d \nReason: %s \nDetails: %s" % (err.error, err.reason, err.detail)
            print result
    else:
        hodClient.GetJobResult(jobID, requestCompleted)

# callback function
def requestCompleted(response, error):
    #resp = ""
    global resp
    if error != None:
        for err in error.errors:
            resp += "Error code: %d \nReason: %s \nDetails: %s\n" % (err.error, err.reason, err.detail)
    else:
        texts = response["document"]
        for text in texts:
            resp += text["content"]
    print resp
    #to_dict(resp)

def main(filename):
    paramArr = {}
    paramArr["file"] = filename#"test.mp3"

    hodClient.PostRequest(paramArr, HODApps.RECOGNIZE_SPEECH, async=True, callback=asyncRequestCompleted)

    print word_dict
    wdjson = json.dumps(word_dict)
    print wdjson
    return resp
    #return wdjson#word_dict

if __name__ == "__main__":
    main('test.mp3')