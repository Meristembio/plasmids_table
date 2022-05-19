import './App.css';
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      plasmids_render: '',
      loading: true
    }
  }

  loadData(){
    const axios = require('axios');
    // const url = 'http://192.168.1.64:8000/inventory/api/plasmids'
    const url = '/inventory/api/plasmids'
    axios.get(url)
      .then((response) => {
        let output = []
        response.data.plasmids.map((plasmid) => {
            const has_perm_to_edit = response.data.has_perm_to_edit
            const csrf_token = response.data.csrf_token
            const table_filters = response.data.table_filters
            let plasmid_level = ""
            if(plasmid.level != null) plasmid_level = " filter-l" + plasmid.level
            let plasmid_type = ""
            if(plasmid.type != null) plasmid_type = " filter-t" + plasmid.type

            let plasmid_computed_size = <div>
                <form method="post" class="default-style inline" action={"/inventory/plasmid/view_edit/" + plasmid.id}>
                    <input type="hidden" name="csrfmiddlewaretoken" value={csrf_token} />
                    <button class="btn btn-outline-success" role="button" name="create"><i class="bi bi-file-earmark-plus"></i></button>
                </form>
                <button class="btn btn-outline-primary enzyme-options" role="button" data-link={"/inventory/plasmid/" + plasmid.id} data-refc={plasmid.refc}><i class="bi bi-hammer"></i></button>
            </div>

            let plasmid_insert_computed_size = ""

            let plasmid_edits = []
            if (has_perm_to_edit){
                plasmid_edits.push(<a href={"/inventory/plasmid_validation/edit/" + plasmid.id} class="btn btn-outline-primary"
                role="button" target="_blank"><i class="bi bi-check2-square"></i></a>)
                plasmid_edits.push(<a href={"/inventory/plasmid/edit/" + plasmid.id} class="btn btn-outline-secondary"
                role="button" target="_blank"><i class="bi bi-pencil-fill"></i></a>)
            }
            let plasmid_sequence_options = []

            if (plasmid.sequence) {
            plasmid_sequence_options.push(<div class="download-links">
                <a href={"/inventory/plasmid/download/" + plasmid.id} class="btn btn-outline-primary"
                   role="button"
                   download={plasmid.name}><i class="bi bi-download"></i> ORIG</a>
                <a href={"/inventory/plasmid/download/" + plasmid.id + "?format=gb"} class="btn btn-outline-primary"
                   role="button"
                   download={plasmid.name}><i class="bi bi-download"></i> .GB</a>
                <a href={"/inventory/plasmid/download/" + plasmid.id + "?format=fasta"}
                   class="btn btn-outline-primary" role="button"
                   download={plasmid.name}><i class="bi bi-download"></i> .FASTA</a>
                </div>)
                plasmid_sequence_options.push(<button type="button" class="btn btn-outline-primary download-options"><i class="bi bi-download"></i></button>)
                plasmid_sequence_options.push(<a href={"/inventory/plasmid/digest/" + plasmid.id} class="btn btn-outline-secondary"
                   role="button" target="_blank"><i class="bi bi-scissors"></i></a>)
                plasmid_sequence_options.push(<a href={"/inventory/plasmid/view_edit/" + plasmid.id} class="btn btn-outline-info"
                   role="button" target="_blank"><i class="bi bi-eye"></i> / <i class="bi bi-pencil"></i></a>)
                plasmid_sequence_options.push(<a href={"/inventory/plasmid/sanger/" + plasmid.id} class="btn btn-outline-warning"
                   role="button" target="_blank"><i class="bi bi-list-nested"></i></a>)
                plasmid_sequence_options.push(<a href={"/inventory/plasmid/pcr/" + plasmid.id} class="btn btn-outline-success"
                   role="button" target="_blank"><i class="bi bi-arrow-return-right"></i></a>)

                if(plasmid.computed_size != null && plasmid.computed_size >0) {
                    if(plasmid.computed_size < 1000){
                        plasmid_computed_size = plasmid.computed_size + " b"
                    } else {
                        plasmid_computed_size = Math.floor(plasmid.computed_size/1000 * 10) / 10 + " k"
                    }

                }
                let plasmid_size_output = plasmid_computed_size
                if(plasmid.insert_computed_size != null && plasmid.insert_computed_size >0) {
                    if(plasmid.insert_computed_size < 1000){
                        plasmid_insert_computed_size = plasmid.insert_computed_size + " b"
                    } else {
                        plasmid_insert_computed_size = Math.floor(plasmid.insert_computed_size/1000 * 10) / 10 + " k"
                    }
                    plasmid_size_output += " / " + plasmid_insert_computed_size
                }
                if(plasmid.computed_size != null) plasmid_computed_size = <span>{plasmid_size_output}</span>
            }
            let plasmid_glicerol_stocks = []
            if(plasmid.glicerol_stocks.length){
                for (let gid in plasmid.glicerol_stocks ){
                    if(gid > 0){
                        plasmid_glicerol_stocks.push(<p></p>)
                    }
                    const gs = plasmid.glicerol_stocks[gid]
                    plasmid_glicerol_stocks.push(
                        <a href={"/inventory/gstock/" + gs.id} role="button" target="_blank" dangerouslySetInnerHTML={{ __html: gs.box}}>
                        </a>
                    )
                }
            } else {
                plasmid_glicerol_stocks.push("No GStocks. ")
                plasmid_glicerol_stocks.push(<a href={"/inventory/gstock/create/" + plasmid.id}
                           class="btn btn-outline-secondary" role="button" target="_blank">Create</a>)
            }
            let table_filters_output = ""
            table_filters.map((table_filter) => {
                if (table_filter[0] == 'startswith'){
                    table_filter[2].map((table_filter_op) => {
                        if (plasmid.name.toLowerCase().startsWith(table_filter_op[1])){
                            table_filters_output += " filter-" + table_filter_op[1]
                        }
                    })
                }
            })
            let plasmid_ok = ""
            // check_state = 'Not required' or 'Correct'
            // sequencing_state = 'Not required' or 'Correct'
            if((plasmid.check_state === 0 || plasmid.check_state === 2) && (plasmid.sequencing_state === 0 || plasmid.sequencing_state === 2)){
                plasmid_ok = <i class="bi bi-check-circle-fill"></i>
            }
            output.push(<tr class={"filter-item" + plasmid_level + plasmid_type + table_filters_output}>
                <td>
                    <a href={"/inventory/plasmid/" + plasmid.id} class="btn btn-success table-search-search_on"
                       role="button" target="_blank">{plasmid.name} {plasmid_ok} <i class="bi bi-clipboard copy_clipboard" data-cc={plasmid.name}></i></a>
                    <a href={"/inventory/plasmid/label/" + plasmid.id} class="btn btn-outline-info"
                       role="button" target="_blank"><i class="bi bi-tag-fill"></i></a>
                    {plasmid_edits}
                </td>
                <td>
                    {plasmid_sequence_options}
                </td>
                <td>
                    {plasmid_computed_size}
                </td>
                <td>
                    {plasmid_glicerol_stocks}
                </td>
            </tr>)
        })
        this.setState({
          plasmids_render: output,
          loading: false
        })
        window.onReady()
      })
  }

  componentDidMount(){
    this.loadData()
  }

  render(){
    let render = <div class="alert alert-info">Loading ...</div>
    if(!this.state.loading){
        render = <table id="plasmids-table" class="table table-striped table-hover sortable table-search-target">
        <thead>
        <tr>
            <th scope="col">Plasmid</th>
            <th scope="col" data-defaultsort='disabled'>Sequence</th>
            <th scope="col" data-defaultsort='disabled'>Total / Insert length</th>
            <th scope="col">GStock Position/Box/Location</th>
        </tr>
        </thead>
        <tbody>{this.state.plasmids_render}</tbody>
       </table>
    }
    return(<div>{render}</div>)
    }
}

export default App;
