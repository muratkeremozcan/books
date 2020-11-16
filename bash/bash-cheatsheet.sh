#!/usr/bin/bash
## bash scripts need to start with #! and the directory of bash
# to find the directory use : which bash

## to execute a bash file:  ./filename   or  <path>
## to execute and use source:  . filename  , this way we keep the parameter context from the file

message="Hello World!"
echo $message


## ARGUMENTS
echo
echo ARGUMENTS
# $0 --> the file name of our script
# $# --> number of args that our script was run with
# $1..$n --> script arguments

# what is our file name?
ourfilename=$0
echo $ourfilename

# how many arguments is the script called with?
num_arguments=$#
echo "number of arguments are ${num_arguments}"

# what are the arguments?
echo "The first three arguments are ${1}, ${2}, ${3}"

## to execute and call a script with arguments:
# ./scriptname arg1 arg2 ...   or use <path> arg1 arg2


## CONDITIONALS
echo
echo CONDITONALS
# if [[condition]]; then
# 	statements
# elif [[condition]]; then
#	statements
# else
# 	statements
# fi

# assign to first arg passed in
NAME=$1 
GREETING="Hi there"
HAT_TIP="*tip of the hat*"
HEAD_SHAKE="*slow head shake*"

if [[ $NAME == "Dave"  ]]; then
	echo $GREETING
elif [[ $NAME == "Steve" ]]; then
	echo $HAT_TIP
else
	echo $HEAD_SHAKE
fi

## CONTROL FLOW with CONDITIONALS

echo
echo CONTROL FLOW WITH CONDITIONALS
echo "-gt >  -lt <  -ge >=  -le <=  , not equal != , equal =="
NUM_REQ_ARGS=2
# do we have at least 2 arguments?

if (( $# <  $NUM_REQ_ARGS )); then
	echo "Not enough arguments. Call this script with ./${0} <name> <number>"
else 
	echo you used the required $NUM_REQ_ARGS arguments
fi

## NULL CHECKING with Zero length -z Not null -n
echo
echo NULL CHECKING with -n or -z

something="something is not null"
emptystring=""

if (( -n $something )); then
	echo "-n something :something is not nully"
fi
if [[ -z $emptystring ]]; then
	echo "-z emptystring :emptystring is nully"
fi	




## LOGIC HELPERS  && and , || or
echo
echo LOGIC HELPERS
$(ls nonexistantfile) || echo "with || the 2nd thing happens if the first fails"
echo
echo $(pwd) && echo "with &&, first and then all remaining things have to happen"

## LOOPS
echo LOOPS 
for arg in "$@"; do
	echo "$arg"
done


## FUNCTIONS
echo
echo FUNCTIONS
number=$2
echo "your first two arguments were $1 $2"

function spaced() {
	echo
	echo "################"
	echo "$1"
	echo "################"
	echo
}

function javatest() {
	# testing conditionals
	if (( $number == 99 )); then
		spaced "You win! You guessed the secret number"
	elif (( $number < 99 )); then
		spaced "You are a courageous one"
	
		# set a variable interactively
		echo "Hi ${name}, avert horrible death, please enter the password: "
		read passw
		echo your password is $passw

		if (( $passw =! Java )); then
			spaced "You can go now"
		else
			spaced "DIE!"
		fi
	fi
}

# call a function
javatest $number


