FROM python:3.11.7-slim-bullseye

WORKDIR /python-docker

COPY requirements.txt requirements.txt

RUN pip install --ignore-installed -r requirements.txt

COPY . .

EXPOSE 80

CMD [ "python", "-m" , "flask", "--app", "api", "run", "--host=0.0.0.0", "-p", "80"]
