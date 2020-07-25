from aiohttp import web

import socketio

sio = socketio.AsyncServer(async_mode='aiohttp')
app = web.Application()
sio.attach(app)

async def index(request):
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

app.router.add_static('/client', 'client')
app.router.add_get('/', index)

if __name__ == '__main__':
    web.run_app(app)
