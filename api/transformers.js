const P = () => class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/bge-small-en';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            let { pipeline, env } = await import('@xenova/transformers');
            this.instance = pipeline(this.task, this.model, {progress_callback});
            return this.instance;
        }
    }
}

let PipelineSingleton;
if (process.env.NODE_ENV !== 'production') {
    // When running in development mode, attach the pipeline to the
    // global object so that it's preserved between hot reloads.
    // For more information, see https://vercel.com/guides/nextjs-prisma-postgres
    if (!global.PipelineSingleton) {
        global.PipelineSingleton = P();
    }
    PipelineSingleton = global.PipelineSingleton;
} else {
    PipelineSingleton = P();
}
module.exports = PipelineSingleton;
