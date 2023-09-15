const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'playerranking_db',
  password: 'mysecretpassword',
  port: 5434,
});

const getTcgRankings = (req, res) => {
  const query = `SELECT
                  tcg.ranking_history.id,                
                  tcg.ranking_history."position" AS rank_no,
                  public.player."name" AS player_name,
                  tcg.ranking_history.points AS dominican_points,
                  tcg.ranking_history.match_records
                 FROM tcg.ranking_history
                 INNER JOIN public.player on public.player.id = tcg.ranking_history.player_id
                 ORDER BY tcg.ranking_history."position" ASC;`;

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getTcgRankings,
};
